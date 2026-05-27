import http.server
import json
import os
import sys

# Import the twin update logic
from update_twin import update_twin_data

PORT = 8080

class InteractiveFarmServer(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/submit-survey':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                survey_data = json.loads(post_data.decode('utf-8'))
                
                # Save to survey_responses.json
                with open('survey_responses.json', 'w', encoding='utf-8') as f:
                    json.dump(survey_data, f, ensure_ascii=False, indent=4)
                
                print("Received survey data:")
                print(json.dumps(survey_data, indent=2, ensure_ascii=False))
                
                # Run the twin update logic
                update_twin_data()
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                response = {"status": "success", "message": "Digital twin updated successfully"}
                self.wfile.write(json.dumps(response).encode('utf-8'))
                
            except Exception as e:
                print(f"Error handling survey post: {e}")
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                response = {"status": "error", "message": str(e)}
                self.wfile.write(json.dumps(response).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

def run_server():
    # Make sure we serve files from the directory where this server.py is located
    server_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(server_dir)
    
    server_address = ('', PORT)
    httpd = http.server.HTTPServer(server_address, InteractiveFarmServer)
    print(f"Interactive Farm Dashboard server running on http://localhost:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
        httpd.server_close()

if __name__ == '__main__':
    run_server()
