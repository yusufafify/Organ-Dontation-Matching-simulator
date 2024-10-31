import { useState } from "react";
import { Donor, Recipient } from "../class/person";
import { addPerson } from "../endpoints/personEndpoint";

const generateId = () => {
  return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

export default function Form() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    organType: "",
    age: "",
    weight: "",
    height: "",
    chronicIllness: "",
    bloodType: "",
    patientStatus: "",
  });
  const [responseForm, setResponseForm] = useState({
    message: "",
    status: "",
    visibility: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a new person object based on the selected patient status
    const person =
      formData.patientStatus === "Donor"
        ? new Donor(
            generateId(), // Generate a unique ID
            formData.name,
            formData.phone,
            formData.bloodType,
            formData.age,
            formData.chronicIllness,
            formData.weight / 1,
            formData.height / 100,
            formData.organType
          )
        : new Recipient(
            generateId(), // Generate a unique ID
            formData.name,
            formData.phone,
            formData.bloodType,
            formData.age,
            formData.chronicIllness,
            formData.weight / 1,
            formData.height / 100,
            formData.organType
          );

    try {
      const response = await addPerson(person, formData.patientStatus);
      console.log(response); // Handle success
      if (response.message) {
        setResponseForm({
          message: response.message,
          status: "success",
          visibility: true,
        });
      }

      // Reset form fields after submission
      setFormData({
        phone: "",
        name: "",
        organType: "",
        age: "",
        weight: "",
        height: "",
        chronicIllness: "",
        bloodType: "",
        patientStatus: "",
      });
    } catch (error) {
      console.error("Failed to add person:", error); // Handle error
      setResponseForm({
        message: "something went wrong",
        status: "failed",
        visibility: true,
      });
    } finally {
      setTimeout(() => {
        setResponseForm({
          message: "",
          visibility: false,
          status: "",
        });
      }, 2000);
    }
  };

  return (
    <div className="text-white flex flex-col items-center lg:pt-12 pt-6 bg-gray-900">
      <form
        className="w-full max-w-3xl p-10 rounded-lg shadow-md bg-gray-800 flex flex-col justify-between"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col mb-6">
          <label className="w-full text-center text-white font-bold text-3xl mb-8">
            Patient Evaluation Data
          </label>
          {responseForm.visibility && (
            <>
              <span
                className={`text-center mb-3 font-semibold text-xl ${
                  responseForm.status === "success"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {responseForm.message}
              </span>
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
            {/* Organ Type */}
            <div className="w-full">
              <label
                className="block uppercase tracking-wide text-white text-xl font-bold mb-3"
                htmlFor="name"
              >
                Name:
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="appearance-none block w-full bg-gray-700 text-white text-lg border border-gray-500 rounded-lg py-4 px-6 leading-tight focus:outline-none focus:bg-gray-600"
                placeholder="Enter Patient Name"
              />
            </div>
            {/* Organ Type */}
            <div className="w-full">
              <label
                className="block uppercase tracking-wide text-white text-xl font-bold mb-3"
                htmlFor="phone_number"
              >
                Phone Number
              </label>
              <input
                id="phone_number"
                name="phone"
                type="number"
                value={formData.phone}
                onChange={handleChange}
                className="appearance-none block w-full bg-gray-700 text-white text-lg border border-gray-500 rounded-lg py-4 px-6 leading-tight focus:outline-none focus:bg-gray-600"
                placeholder="Enter Phone number"
              />
            </div>
            {/* Organ Type */}

            <div className="w-full">
              <label
                className="block uppercase tracking-wide text-white text-xl font-bold mb-3"
                htmlFor="organ-type"
              >
                Organ Type:
              </label>
              <select
                id="organ-type"
                name="organType"
                value={formData.organType}
                onChange={handleChange}
                className="block w-full bg-gray-700 text-white text-lg border border-gray-500 rounded-lg py-4 px-6 leading-tight focus:outline-none focus:bg-gray-600"
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option value="Heart">Heart</option>
                <option value="Kidney">Kidney</option>
                <option value="Liver">Liver</option>
                <option value="Lung">Lung</option>
                <option value="Pancreas">Pancreas</option>
                <option value="Intestine">Intestine</option>
              </select>
            </div>

            {/* Age */}
            <div className="w-full">
              <label
                className="block uppercase tracking-wide text-white text-xl font-bold mb-3"
                htmlFor="age"
              >
                Age:
              </label>
              <input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                className="appearance-none block w-full bg-gray-700 text-white text-lg border border-gray-500 rounded-lg py-4 px-6 leading-tight focus:outline-none focus:bg-gray-600"
                placeholder="Enter Age"
              />
            </div>

            {/* Weight */}
            <div className="w-full">
              <label
                className="block uppercase tracking-wide text-white text-xl font-bold mb-3"
                htmlFor="weight"
              >
                Weight:
              </label>
              <input
                id="weight"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                className="appearance-none block w-full bg-gray-700 text-white text-lg border border-gray-500 rounded-lg py-4 px-6 leading-tight focus:outline-none focus:bg-gray-600"
                placeholder="Enter Weight"
              />
            </div>

            {/* Height */}
            <div className="w-full">
              <label
                className="block uppercase tracking-wide text-white text-xl font-bold mb-3"
                htmlFor="height"
              >
                Height <span className="text-sm lowercase">{"(cm)"}</span> :
              </label>
              <input
                id="height"
                name="height"
                type="text"
                value={formData.height}
                onChange={handleChange}
                className="appearance-none block w-full bg-gray-700 text-white text-lg border border-gray-500 rounded-lg py-4 px-6 leading-tight focus:outline-none focus:bg-gray-600"
                placeholder="Enter Height"
              />
            </div>
          </div>

          {/* Other Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
            {/* Chronic Illness */}
            <div className="w-full">
              <label
                className="block uppercase tracking-wide text-white text-xl font-bold mb-3"
                htmlFor="chronic-illness"
              >
                Chronic Illness?
              </label>
              <select
                id="chronic-illness"
                name="chronicIllness"
                value={formData.chronicIllness}
                onChange={handleChange}
                className="block w-full bg-gray-700 text-white text-lg border border-gray-500 rounded-lg py-4 px-6 leading-tight focus:outline-none focus:bg-gray-600"
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            {/* Blood Type */}
            <div className="w-full">
              <label
                className="block uppercase tracking-wide text-white text-xl font-bold mb-3"
                htmlFor="blood-type"
              >
                Blood Type:
              </label>
              <input
                id="blood-type"
                name="bloodType"
                type="text"
                value={formData.bloodType}
                onChange={handleChange}
                className="appearance-none block w-full bg-gray-700 text-white text-lg border border-gray-500 rounded-lg py-4 px-6 leading-tight focus:outline-none focus:bg-gray-600"
                placeholder="Enter Blood Type"
              />
            </div>
          </div>

          {/* Patient Status */}
          <div className="w-full mb-8">
            <label
              className="block uppercase tracking-wide text-white text-xl font-bold mb-3"
              htmlFor="patient-status"
            >
              Patient is:
            </label>
            <select
              id="patient-status"
              name="patientStatus"
              value={formData.patientStatus}
              onChange={handleChange}
              className="block w-full bg-gray-700 text-white text-lg border border-gray-500 rounded-lg py-4 px-6 leading-tight focus:outline-none focus:bg-gray-600"
            >
              <option value="" disabled>
                Select an option
              </option>
              <option value="Donor">Donor</option>
              <option value="Recipient">Recipient</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="mt-10">
            <button
              type="submit"
              className="w-full bg-green-600 text-white font-bold text-xl py-4 px-6 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
