import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  test("renders Home component when '/' path is accessed", () => {
    render(<App />);
    // Assert that the Home component is rendered when '/' path is accessed
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  test("renders AddTask component when '/add-task' path is accessed", () => {
    render(<App />);
    // Assert that the AddTask component is rendered when '/add-task' path is accessed
    expect(screen.getByText("AddTask")).toBeInTheDocument();
  });

  test("renders CurrentTask component when '/current-task' path is accessed", () => {
    render(<App />);
    // Assert that the CurrentTask component is rendered when '/current-task' path is accessed
    expect(screen.getByText("CurrentTask")).toBeInTheDocument();
  });
});