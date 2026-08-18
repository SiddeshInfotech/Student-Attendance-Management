import base64
import json
import io
import numpy as np

def extract_face_features(image_base64_or_bytes):
    """
    Decodes base64 or bytes image, detects face using OpenCV, 
    and returns a normalized feature vector list (or None, error_message if failed).
    """
    try:
        import cv2
        from PIL import Image

        if isinstance(image_base64_or_bytes, str):
            if "," in image_base64_or_bytes:
                image_base64_or_bytes = image_base64_or_bytes.split(",")[1]
            img_bytes = base64.b64decode(image_base64_or_bytes)
        else:
            img_bytes = image_base64_or_bytes

        nparr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            # Fallback to PIL
            pil_img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
            img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)

        if img is None:
            return None, "Invalid image data provided."

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Load Haar Cascade
        cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        face_cascade = cv2.CascadeClassifier(cascade_path)

        faces = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=3,
            minSize=(30, 30)
        )

        if len(faces) == 0:
            # Fallback crop center region if cascade misses face
            h, w = gray.shape
            min_dim = min(h, w)
            top = (h - min_dim) // 2
            left = (w - min_dim) // 2
            face_roi = gray[top:top+min_dim, left:left+min_dim]
        else:
            # Take largest face
            faces = sorted(faces, key=lambda f: f[2]*f[3], reverse=True)
            x, y, w, h = faces[0]
            face_roi = gray[y:y+h, x:x+w]

        # Resize to standard 64x64 feature matrix
        resized = cv2.resize(face_roi, (64, 64))
        equalized = cv2.equalizeHist(resized)
        normalized = equalized.astype(np.float32) / 255.0
        feature_vector = normalized.flatten().tolist()

        return feature_vector, None

    except Exception as e:
        return None, f"Face processing error: {str(e)}"


def compare_face_features(vector1, vector2):
    """
    Computes cosine similarity between two feature vectors.
    Returns float score between 0.0 and 1.0.
    """
    try:
        v1 = np.array(vector1, dtype=np.float32)
        v2 = np.array(vector2, dtype=np.float32)
        
        if v1.shape != v2.shape:
            return 0.0

        dot = np.dot(v1, v2)
        norm1 = np.linalg.norm(v1)
        norm2 = np.linalg.norm(v2)

        if norm1 == 0 or norm2 == 0:
            return 0.0

        similarity = dot / (norm1 * norm2)
        return float(similarity)
    except Exception:
        return 0.0
