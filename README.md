# GameSwap Project Overview
GameSwap is a database project part of CS-6400 Georgia Tech. The purpose of this project is to analyze, specify, design, implement, document, and demonstrate an app developed as a team.

In recent years, the sales of board games, video game systems, and other home entertainment activities skyrocketed. Today, many people find themselves with a surplus of games and other items. GameSwap is a bartering website for trading these items. Initially, it will be limited to some specific types of items and is intended for making local trades, although users who are not located close to each other might figure out shipping details on their own.

![alt text](https://github.gatech.edu/cs6400-2022-01-spring/cs6400-2022-01-Team083/blob/main/GameSwap/mainmenu.png?raw=true)



# Project setup instructions

### A.  Install WampServer
*  [WAMP development environment version 3.2.6_x64](https://www.wampserver.com/en/)

### B.  Create Database schema & seed data
Use PHPMyAdmin to create the schema by executing scripts under the [db_schema](https://github.gatech.edu/cs6400-2022-01-spring/cs6400-2022-01-Team083/tree/main/GameSwap/db_schema) folder. 


### C.  Install recommended tools and extensions.
*  [Git for Windows](https://git-scm.com/download/win)
*  [Visual Studio Code](https://code.visualstudio.com/) 
*  [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
*  [React Snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)
*  [JS/JSX Snippets](https://marketplace.visualstudio.com/items?itemName=skyran.js-jsx-snippets)


### D.  Install Prerequisites

#### 1.  Install [Node.js Version: 17.8.0](https://nodejs.org/en/download/current/) 


#### 2.  Clone the Repository 
*  To clone the [cs6400-2022-01-Team083](https://github.gatech.edu/cs6400-2022-01-spring/cs6400-2022-01-Team083) repo under `C:/wamp64/www/` execute
```bash
Git clone https://github.gatech.edu/cs6400-2022-01-spring/cs6400-2022-01-Team083 C:/wamp64/www/
```

After cloning using `VS Code` or in the `Git BASH` execute below commands to install and update the required dependencies.
```bash
cd C:/wamp64/www/GameSwap/react_frontend
npm install 
npm update
``` 

#### 3.  Run the project.
After all the packages downloaded and installed execute below command to run the project.
```bash
cd C:/wamp64/www/GameSwap/react_frontend
npm start
``` 


#### 4. If above steps did not work for you you may install React components via npm

1. [React Hook Form](https://react-hook-form.com/)
```bash
npm install react-hook-form
``` 

2. [React Icons](https://react-icons.github.io/react-icons/)
```bash
npm install react-icons --save
``` 

3. [Tailwind CSS](https://tailwindcss.com/docs/guides/create-react-app) 
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
``` 

4. [React Number Format](https://www.npmjs.com/package/react-number-format)
```bash
npm install react-number-format --save
``` 


