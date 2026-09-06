import requests

test_img = 'C:/SeaSentinelAI/dataset/AI4Shipwrecks/train/images/DM_Wilson_03.png'
with open(test_img, 'rb') as f:
    files = {'file': (test_img, f, 'image/png')}
    res = requests.post('http://127.0.0.1:8000/predict?confidence_threshold=0.40', files=files)
    print('Status:', res.status_code)
    data = res.json()
    print('Debug Telemetry:', data.get('debug'))
    dets = data.get('detections', [])
    print(f'Total Detections returned: {len(dets)}')
    for d in dets:
        bx = d['boxPixels']
        print(f"  [{d['trackingId']}] {d['classification']} ({d['confidence']*100:.1f}%) - Box=({bx['x1']}, {bx['y1']}, {bx['x2']}, {bx['y2']})")
