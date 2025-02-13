# file-upload-server

Small server that can handle a file and a name in POST request, 
made as a backend part for a testing task to candidate on role of JS Developer.

### There are two ways how to run this project:

First, using node.js:  
<code>node app.js</code>  
  
Second way using docker:  
Build docker with command:  
<code>docker build -t file-upload-server .</code>  
Then run docker container with command:  
<code>docker run --name fileServer -p 3000:3000 file-upload-server</code>

Demo server is deployed to Render on address <code>https://file-upload-server-mc26.onrender.com</code>

## Description of API:  
API Address: https://file-upload-server-mc26.onrender.com
Upload File Endpoint
-	URL: /api/v1/upload
-	Method: POST
-	Description: Upload a file (1 KB size limit, allowed types: .json, .txt, .csv and a person’s name.

Request
-	Headers:
-	Content-Type: multipart/form-data
-	Body:
-	file: The file to be uploaded.
-	name: The name field (e.g., "name": "ExampleName").

Example form data:
file=@path/to/your/file.json.  
name=ExampleName

File Size: Max 1 KB (1024 bytes).  
File Types: Only .json, .txt, .csv.

Response
-	200 OK (Success):
     ```
     {
       "message": "File uploaded successfully",
       "filename": "1234567890123_filename.json",
       "nameField": "ExampleName",
       "timestamp": "2025-02-13T12:00:00Z"
     }  
     ```
- 400 Bad Request (Error):
  -	File size exceeds limit:  
       ```
       {
         "error": "Uploaded file exceeds the 1 KB size limit"
       }
       ```
  - No file uploaded:
       ```
       {
         "error": "No file uploaded"
       }
       ```
  - Invalid file type:
       ```
      {
         "error": "Invalid file type"
      }
      ```
-	500 Internal Server Error:
     ```
      {
        "error": "Internal Server Error",
        "details": "error message details"
      }
     ```

Possible Errors
-	400: Bad Request (e.g., file size exceeds limit, invalid file type, or no file uploaded).
-	500: Internal Server Error (unexpected issues on the server side).

