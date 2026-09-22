import time
import base64
import io
import cv2
import numpy as np
from PIL import Image
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ultralytics import YOLO

app = FastAPI(title="SURAKSHA-NET YOLO Person Analytics Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load lightweight YOLOv8 nano model (optimized for real-time CPU / GPU inference)
print("Loading YOLOv8 model for Person Detection...")
model = YOLO("yolov8n.pt")
print("YOLOv8 ready. Detecting class 0 (person only).")

# Global tracking set to maintain unique people tracked across the session
unique_track_ids = set()
start_time = time.time()
frame_count = 0
last_fps = 0.0

# Predefined operational zones for Deekshabhoomi Grid FOV mapping
# Coordinates are normalized (0.0 to 1.0) across camera field of view:
# Left = Zone A / Exit Gate 1
# Center Top = Main Pathway
# Center Bottom = Zone B
# Right Top = Exit Gate 2
# Right Bottom = East Gate / Zone C
def map_point_to_zone(cx: float, cy: float) -> str:
    if cx < 0.32:
        if cy < 0.45:
            return "Exit Gate 1"
        return "Zone A"
    elif cx > 0.68:
        if cy < 0.45:
            return "Exit Gate 2"
        elif cy > 0.75:
            return "East Gate"
        return "Zone C"
    else:
        if cy < 0.48:
            return "Main Pathway"
        return "Zone B"

def process_frame(img_array: np.ndarray):
    global unique_track_ids, frame_count, last_fps, start_time
    
    t0 = time.time()
    h, w = img_array.shape[:2]
    
    # Run YOLOv8 person detection & ByteTrack tracking (classes=[0] means PERSON ONLY)
    results = model.track(img_array, classes=[0], persist=True, verbose=False)
    
    inference_time = (time.time() - t0) * 1000.0 # ms
    frame_count += 1
    if time.time() - start_time >= 1.0:
        last_fps = round(frame_count / (time.time() - start_time), 1)
        frame_count = 0
        start_time = time.time()
        
    detected_persons = []
    zone_counts = {
        "Zone A": 0,
        "Zone B": 0,
        "Zone C": 0,
        "Main Pathway": 0,
        "East Gate": 0,
        "Exit Gate 1": 0,
        "Exit Gate 2": 0,
    }
    
    if results and len(results) > 0:
        boxes = results[0].boxes
        if boxes is not None and len(boxes) > 0:
            for box in boxes:
                # Bounding box coordinates [x1, y1, x2, y2]
                xyxy = box.xyxy[0].tolist()
                x1, y1, x2, y2 = xyxy
                conf = float(box.conf[0])
                
                # Get tracking ID if available, otherwise generate ephemeral index
                track_id = int(box.id[0]) if box.id is not None else 1
                unique_track_ids.add(track_id)
                
                # Normalized center point
                cx = ((x1 + x2) / 2.0) / w
                cy = ((y1 + y2) / 2.0) / h
                
                # Clamp to [0..1]
                cx = max(0.0, min(1.0, cx))
                cy = max(0.0, min(1.0, cy))
                
                zone = map_point_to_zone(cx, cy)
                if zone in zone_counts:
                    zone_counts[zone] += 1
                    
                detected_persons.append({
                    "id": track_id,
                    "confidence": round(conf, 2),
                    "box": [round(x1, 1), round(y1, 1), round(x2, 1), round(y2, 1)],
                    "norm_box": [round(x1/w, 3), round(y1/h, 3), round(x2/w, 3), round(y2/h, 3)],
                    "center": [round(cx, 3), round(cy, 3)],
                    "zone": zone,
                })

    current_count = len(detected_persons)
    tracked_total = len(unique_track_ids)
    
    # Realistic operational crowd estimate based on current camera frame density
    # In mass gatherings, a single camera sample covering a sector is extrapolated to sector estimate
    estimated_crowd = max(current_count, int(current_count * 1.6 + tracked_total * 0.4))
    
    return {
        "status": "CONNECTED",
        "current_people": current_count,
        "tracked_people": tracked_total,
        "estimated_crowd": estimated_crowd,
        "fps": last_fps if last_fps > 0 else round(1000.0 / max(inference_time, 1.0), 1),
        "inference_ms": round(inference_time, 1),
        "persons": detected_persons,
        "zones": zone_counts,
        "timestamp": time.time(),
    }

class FrameRequest(BaseModel):
    image: str # base64 data url or raw base64 string

@app.get("/health")
def health():
    return {
        "status": "ONLINE",
        "service": "YOLOv8 Person Tracker",
        "model": "yolov8n.pt",
        "classes": ["person"],
        "unique_tracked": len(unique_track_ids),
    }

@app.post("/reset_tracking")
def reset_tracking():
    global unique_track_ids
    unique_track_ids.clear()
    return {"status": "RESET", "tracked_people": 0}

@app.post("/detect")
def detect_endpoint(req: FrameRequest):
    data = req.image
    if "," in data:
        data = data.split(",")[1]
    
    img_bytes = base64.b64decode(data)
    nparr = np.frombuffer(img_bytes, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if frame is None:
        return {"error": "Failed to decode image frame"}
        
    return process_frame(frame)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("Webcam client connected via WebSocket.")
    try:
        while True:
            # Receive frame as text (base64 string)
            data = await websocket.receive_text()
            if "," in data:
                data = data.split(",")[1]
            img_bytes = base64.b64decode(data)
            nparr = np.frombuffer(img_bytes, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if frame is not None:
                result = process_frame(frame)
                await websocket.send_json(result)
            else:
                await websocket.send_json({"error": "Invalid frame"})
    except WebSocketDisconnect:
        print("Webcam client disconnected.")
    except Exception as e:
        print(f"WebSocket error: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="warning")
