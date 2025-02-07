import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const isPrime = (num) => {
    if(num < 2) return false;

    for (let i = 2; i <= Math.sqrt(num); i++) {
        if(num % i === 0) return false;
    }
    return true;
}

const isPerfect = (num) => {
    if (num < 2) return false;
    let sum = 1;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) {
        sum += i;
        if (i !== num / i) sum += num / i;
      }
    }
    return sum === num;
};

const isArmstrong = (num) => {
    const digits = String(num).split('');
    const length = digits.length;
    const sum = digits.reduce((acc, digit) => acc + Math.pow(Number(digit), length), 0);
    return sum === num;
};

const getDigitSum = (num) => {
    return String(num).split('').reduce((acc, digit) => acc + Number(digit), 0);
};

const getFunFact = async (num) => {
    try {
        const response = await axios.get(`http://numbersapi.com/${num}/math`);
        return response.data;
    } catch (error) {
        return `Sorry, No fun fact available for ${num}`;
    }
};

// API endpoint
app.get("/", (req, res) => {
    console.log("Home route")
    res.status(404).json({
        success: false,
        message: "This is the home route, you need to go to https://number-classification-api-02.onrender.com/api/classify-number?number={any number of your choice} to try out this endpoint"
    })
})

app.get('/api/v1/classify-number', async (req, res) => {
    console.log("Get number property route")
    const { number } = req.query;
  
    // Input validation
    if (!number || isNaN(number)) {
        return res.status(400).json({
          number: number || 'undefined',
          error: true,
        });
      }
  
    const num = parseInt(number, 10);
  
    // Determine properties
    const properties = [];
    if (isArmstrong(num)) properties.push('armstrong');
    if (num % 2 === 0) properties.push('even');
    else properties.push('odd');
  
    // Fetch fun fact
    const funFact = await getFunFact(num);
  
    // Construct response
    const response = {
      number: num,
      is_prime: isPrime(num),
      is_perfect: isPerfect(num),
      properties,
      digit_sum: getDigitSum(num),
      fun_fact: funFact,
    };
  
    res.status(200).json(response);
  });

  app.get("*", (req, res) => {
    console.log("Route not found")
    res.status(404).json({
        success: false,
        message: "Route is not available, check route or try again later"
    })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});