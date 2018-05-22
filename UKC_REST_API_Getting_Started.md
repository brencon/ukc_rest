# Getting Started with UKC REST API
Unbound Key Control (UKC) can be used and managed through a REST API. This tutorial shows you how to create a simple application which
interacts with UKC through the REST API.

The UKC REST API uses [Swagger/OpenAPI](https://swagger.io) open source technology and tools. This tutorial shows you how to use some of these tools to support your development process. The tutorial uses JavaScript code, however with Swagger tools you can easily create API code for a variety of languages.

## Prerequisites
You need the following prerequisites:
+ [Node.js](https://nodejs.org) 8.0.0 or above
+ A working UKC server. Refer to the *Unbound Key Control User Guide* for installation instructions.
+ UKC Admin API YAML file [admin.yaml](./admin.yaml)
+ [Java](https://java.com/en/download/) version 8 or above

## Generate the Language API
In this step, we use the [Swagger code generator](https://github.com/swagger-api/swagger-codegen) to generate code for easy interaction with the UKC server through the REST API, saving us from all the tedious manual work of coding the HTTP interaction layer ourselves. 

As mentioned before, this guide uses JavaScript as the client language, but you can easily generate code for other languages. Refer to [here](https://github.com/swagger-api/swagger-codegen/blob/master/README.md) for more information.

1. Download the Swagger code generator from [here](http://central.maven.org/maven2/io/swagger/swagger-codegen-cli/2.3.1/swagger-codegen-cli-2.3.1.jar). Alternatively, you can use the following commands to download it:
   + For Linux
      ```bash
      wget http://central.maven.org/maven2/io/swagger/swagger-codegen-cli/2.3.1/swagger-codegen-cli-2.3.1.jar
      ```
   + For mac OSx
     ```bash
     curl http://central.maven.org/maven2/io/swagger/swagger-codegen-cli/2.3.1/swagger-codegen-cli-2.3.1.jar -o swagger-codegen-cli-2.3.1.jar
     ```
   + For Windows PowerShell:
      ```bash
      wget http://central.maven.org/maven2/io/swagger/swagger-codegen-cli/2.3.1/swagger-codegen-cli-2.3.1.jar -OutFile swagger-codegen-cli-2.3.1.jar
      ```

2. Run the following command to display all available languages for generating code in other languages.
   ```bash
   $ java -jar swagger-codegen-cli-2.3.1.jar
   ```

3. Copy the *admin.yaml* file to your current directory.

4. To generate the API package, run the following command:
   ```
   java -jar swagger-codegen-cli-2.3.1.jar generate -i admin.yaml -o ./dist -l javascript --additional-properties usePromises=true
   ```

5. To generate the HTML documentation, run the following command:  
   ```bash
   java -jar swagger-codegen-cli-2.3.1.jar generate -i admin.yaml -o ./doc -l html2
   ```

6. Install the generated UKC API package:
   ```
   npm i --save ./dist
   ```

7. Copy *testukc.js* to your current directory. This file comes with the tutorial source code.

8. Run the test script. This script creates a partition and adds a user.
   ```
   node testukc.js
   ```
   If the test runs successfully, you should receive the following message:
   ```
   Test script completed successfully
   ```

Note: You can use the same procedure for the UKC Crypto API YAML file [crypto.yaml](./crypto.yaml).
