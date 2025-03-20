const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/add', (req, res) => {
    // Parse the numbers from the query parameters
    const a = parseFloat(req.query.a);
    const b = parseFloat(req.query.b);
    // Calculate the sum
    const sum = a + b;
    res.send(`The sum of ${a} and ${b} is: ${sum}`);
});    

app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`);
});
