const express = require('express');
const postRoutes = require('./routes/postRoutes');

const app = express();

app.use(postRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});