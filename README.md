# bankApi

After cloning, create/ add a .env file that will specify your api port, token key and your mongodb uri i.e.

#API_PORT= your_custom_port
#TOKEN_KEY = your_token_key
#MONGO_URI= your_mongo_uri
You can create an account on Atlas and copy your details from your cluster


In your index.html, replace the port in the io instance with your the port in your env file. 
To view the tiny frontend app locally, run your port e.g localhost:3000/ to test web socket

IP is limited to 10 requests per call

To run the app, use command 'npm run dev'
To run the test suites, use command 'npm test'
