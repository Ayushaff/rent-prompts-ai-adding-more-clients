"use client";
import React, { useState } from "react";

type Variable = {
  id: string;
  name: string;
  displayName: string;
  dataType: string;
  description: string;
  placeholder: string;
  value?: string; // Added to hold the value entered by the user
};

const PromptInput = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [variables, setVariables] = useState<Variable[]>([]);
  const [editableVariable, setEditableVariable] = useState<Variable | null>(
    null
  );

  // Handle prompt change and extract variables
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = e.target.value;
    setPrompt(inputText);

    // Extract variables starting with $ sign using regex
    const variablePattern = /\$[a-zA-Z_]\w*/g;
    const matches = new Set(inputText.match(variablePattern) || []);

    // Check if the variable already exists, if not add new ones
    const newVariables = Array.from(matches).map((variable, index) => {
      const existingVariable = variables.find((v) => v.name === variable);
      return (
        existingVariable || {
          id: Date.now().toString() + index, // Unique id
          name: variable,
          displayName: variable,
          dataType: "text", // default data type
          description: "",
          placeholder: "",
          value: "", // Initialize value as empty
        }
      );
    });

    // Update the variables state
    setVariables(newVariables);
  };

  // Update the local editable variable (temporary changes)
  const handleVariableChange = (field: keyof Variable, value: string) => {
    if (editableVariable) {
      setEditableVariable((prev) => prev && { ...prev, [field]: value });
    }
  };

  // Save changes to the current variable
  const saveVariable = (id: string) => {
    setVariables((prevVariables) =>
      prevVariables.map((variable) =>
        // variable.id === id ? { ...editableVariable } : variable
        {
          if (variable.id === id) {
            if (editableVariable) {
              return editableVariable;
            }
          }
          return variable;
        }
      )
    );
    setEditableVariable(null); // Clear the editable variable
  };

  // Set the editable variable when clicking "Edit"
  const editVariable = (variable: Variable) => {
    setEditableVariable(variable);
  };

  // Update the value of each form field
  const handleInputChange = (id: string, value: string) => {
    setVariables((prevVariables) =>
      prevVariables.map((variable) =>
        variable.id === id ? { ...variable, value } : variable
      )
    );
  };

  // Handle form submit and log form values
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const filledValues = variables.map((variable) => ({
      displayName: variable.displayName,
      value: variable.value,
      dataType: variable.dataType,
      description: variable.description,
      placeholder: variable.placeholder,
      id: variable.id,
      name: variable.name,
    }));

    console.log("Prompt:", prompt);
    console.log("Form Values:", filledValues);
  };

  return (
    <div>
      <h1>Create Prompt</h1>
      <textarea
        value={prompt}
        onChange={handlePromptChange}
        placeholder="Write your prompt here..."
        rows={5}
        cols={50}
      />

      <h2>Configure Variables</h2>
      {variables.map((variable) => (
        <div key={variable.id}>
          <h3>{variable.name}</h3>
          {editableVariable?.id === variable.id ? (
            <div>
              <input
                type="text"
                placeholder="Display Name"
                value={editableVariable.displayName}
                onChange={(e) =>
                  handleVariableChange("displayName", e.target.value)
                }
              />
              <select
                value={editableVariable.dataType}
                onChange={(e) =>
                  handleVariableChange("dataType", e.target.value)
                }
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="checkbox">Checkbox</option>
                <option value="radio">Radio</option>
                <option value="range">Range</option>
              </select>
              <input
                type="text"
                placeholder="Description"
                value={editableVariable.description}
                onChange={(e) =>
                  handleVariableChange("description", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Placeholder"
                value={editableVariable.placeholder}
                onChange={(e) =>
                  handleVariableChange("placeholder", e.target.value)
                }
              />
              <button onClick={() => saveVariable(variable.id)}>Save</button>
            </div>
          ) : (
            <div>
              <p>Display Name: {variable.displayName}</p>
              <p>Data Type: {variable.dataType}</p>
              <p>Description: {variable.description}</p>
              <p>Placeholder: {variable.placeholder}</p>
              <button onClick={() => editVariable(variable)}>Edit</button>
            </div>
          )}
        </div>
      ))}

      <h2>Generated Form</h2>
      <form onSubmit={handleFormSubmit}>
        {variables.map((variable) => (
          <div key={variable.id}>
            <label>{variable.displayName}</label>
            {variable.dataType === "text" && (
              <input
                type="text"
                placeholder={variable.placeholder}
                value={variable.value}
                onChange={(e) => handleInputChange(variable.id, e.target.value)}
              />
            )}
            {variable.dataType === "number" && (
              <input
                type="number"
                placeholder={variable.placeholder}
                value={variable.value}
                onChange={(e) => handleInputChange(variable.id, e.target.value)}
              />
            )}
            {
              variable.dataType === "checkbox" && (
                <input
                  type="checkbox"
                  checked={variable.value === "on"}
                  onChange={(e) => handleInputChange(variable.id, e.target.value)}
                />
              )
            }
            {
              variable.dataType === "radio" && (
                <input
                  type="radio"
                  checked={variable.value === "true"}
                  onChange={(e) => handleInputChange(variable.id, e.target.value)}
                />
              )
            }
            {
              variable.dataType === "range" && (
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={variable.value}
                  onChange={(e) => handleInputChange(variable.id, e.target.value)}
                />
              )
            }
            <p>{variable.description}</p>
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PromptInput;
