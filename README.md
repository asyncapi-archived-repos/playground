# AsyncAPI Playground

# Build docker image

```
docker build -t asyncapi-playground .
```

# Run docker image

```
docker run -d --name asyncapi_editor -p 83:5000 asyncapi-editor:latest
```

Then browse to http://localhost:83/

