FROM microsoft/azure-functions-runtime:2.0.0-jessie
ENV AzureWebJobsScriptRoot=/home/site/wwwroot

WORKDIR /home/site/wwwroot

COPY common common
COPY hello hello
COPY product-availability product-availability
COPY product-recommendation product-recommendation

# get the deps
COPY scripts/install.js scripts/install.js
RUN ./scripts/install.js

# we do this so that requests coming from vm dont need access tokens
COPY scripts/anonymous-dev-functions.js scripts/anonymous-dev-functions.js
RUN ./scripts/anonymous-dev-functions.js

WORKDIR /app

EXPOSE 80
