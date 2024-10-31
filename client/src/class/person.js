
class Person {
  constructor(id,name,phone, bloodType, age, disease, weight, height, organ) {

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

export {Donor,Recipient}