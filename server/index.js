const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
// Middleware to parse incoming JSON requests
app.use(express.json());


class Person {
  constructor(id,name,phone, bloodType, age,urgency=0, disease, weight, height, organ) {

      this.id = id;
      this.name=name;
      this.phone=phone;
      this.blood_type = bloodType;
      this.age = age;
      this.urgency = 0;
      this.disease = disease;
      this.weight = weight;
      this.height = height;
      this.organ = organ;
  }
}

class Donor extends Person {}
class Recipient extends Person {}


// Function to save persons into a JSON file
function savePersons(persons, type) {
  const filePath = path.join(__dirname, `${type}s.json`);
  fs.writeFileSync(filePath, JSON.stringify(persons, null, 2));
  console.log(
    `${type.charAt(0).toUpperCase() + type.slice(1)}s saved to ${filePath}`
  );
}

function loadPersons(type) {
  const filePath = path.join(__dirname, `${type}s.json`);
  if (!fs.existsSync(filePath)) return [];

  const data = JSON.parse(fs.readFileSync(filePath));

  return data.map((personData) => {
    const person = type === "donor"
      ? new Donor(...Object.values(personData))
      : new Recipient(...Object.values(personData));

    // Convert class instance to plain object
    return Object.assign({}, person);
  });
}


// Function to add a new person (donor/recipient)
function addPerson(person, type) {
  const persons = loadPersons(type);
  persons.push(person);
  savePersons(persons, type);
}

// API to load all donors or recipients
app.get("/api/persons/:type", (req, res) => {
  const type = req.params.type.toLowerCase();
  if (type !== "donor" && type !== "recipient") {
    return res.status(400).json({ error: "Invalid person type" });
  }
  const persons = loadPersons(type);
  res.json(persons);
});

// API to add a new donor or recipient
app.post("/api/persons/:type", (req, res) => {
  const type = req.params.type.toLowerCase();
  if (type !== "donor" && type !== "recipient") {
    return res.status(400).json({ error: "Invalid person type" });
  }

  const newPerson = req.body;
  addPerson(newPerson, type);
  res
    .status(201)
    .json({
      message: `${
        type.charAt(0).toUpperCase() + type.slice(1)
      } added successfully!`,
    });
});

// Server listens on the defined port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
