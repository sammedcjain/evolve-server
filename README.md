# EV_Dekho
Deployed Link = https://evolve-client.vercel.app/ <br>
Ev_Dekho is a full-stack web application through which users can explore electric vehicles. <br>
Built using Node.js, Express.js, React.js , MongoDB. <br>
This repository - evolve-server only containts the node.js server side code and you can find the frontend - react code in <a href="https://github.com/sammedcjain/evolve-client">evolve-client</a> repo.

## Various functionalities have been mentioned below:

- User login, register, logout.
- Admin login, register, logout.
- Admin data entry - add, update, delete.
- Users can :
  - explore electric vehicles by specifying their requirements such as price range, speed, etc.
  - Users can also view details, specifications, the vehicle's photo, and reviews.
  - Users can compare 2 or 3 electric vehicles side by side. Users can also filter out the comparision by selecting the comparision criteria.
  - Users can calculate their savings if they switch to an EV from their petrol/diesel vehicle. They will also be able to calculate the carbon footprint they leave behind and how it can be reduced by switching to EVs.
  - The recently viewed vehicles of the users and the total user count are also displayed on the home page.

## Few major packages and dependencies used :

- For Frontend:

  - axios
  - react-router-dom
  - jquery
  - react-scripts
  - react-bootstrap
  - react-toastify
  - react-icons
  - react-spinners

- For Backend :

  - jsonwebtoken
  - Bcrypt
  - mongodb
  - mongoose
  - dotenv
  - body-parser

Backend node.js server is deployed using render = https://evolve-server.onrender.com/ <br>
Front-end react part is deployed using Vercel = https://evolve-client.vercel.app/ 

You can access my website using this link: https://evolve-client.vercel.app/
