Below is an example README file for your project, which includes instructions for running the application locally with Docker and mentions deployment on Vercel:

---

# US Power Plant Net Generation Visualization

This project is a web application that visualizes the annual net generation of power plants in the United States on a map. It allows users to display the top N plants, view the absolute value and percentage of a plant's federal state, and filter by state to zoom in on specific regions.

## Requirements

- Node.js and npm installed on your local machine
- Docker installed on your local machine

## Installation and Setup

1. Clone this repository to your local machine:

```bash
git clone https://github.com/itzpranz/aiq-challange-power-plant-data.git
```

2. Navigate to the project directory:

```bash
cd your-project
```

3. Build the Docker image:

```bash
docker build -t us-power-plant-visualization .
```

4. Run the Docker container:

```bash
docker run -p 8080:8080 us-power-plant-visualization
```

5. Access the application in your web browser at `http://localhost:8080`.

## Deployed Version

This application is deployed on Vercel and can be accessed at [us-power-plant-visualization.vercel.app](https://us-power-plant-visualization.vercel.app/).

## Data Source

The data for this application is sourced from the [eGRID2021 Data File](https://www.epa.gov/egrid/download-data) provided by the Environmental Protection Agency (EPA).
