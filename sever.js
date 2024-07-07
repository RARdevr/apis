const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());

app.use(express.static('public'));
app.use(express.json());

app.post('/upload', upload.fields([{ name: 'image0' }, { name: 'image1' }, { name: 'image2' }]), (req, res) => {
    const { name, link, price, brand } = req.body;
    const images = [
        req.files.image0[0].filename,
        req.files.image1[0].filename,
        req.files.image2[0].filename
    ].map(filename => `${filename}.jpg`);

    const itemData = {
        name,
        link,
        price: parseFloat(price).toFixed(2),
        brand,
        images
    };

    const itemFolderPath = path.join(__dirname, 'data', name);
    const imagesFolderPath = path.join(itemFolderPath, 'images');
    const jsonFilePath = path.join(itemFolderPath, `${name}.json`);

    fs.mkdirSync(imagesFolderPath, { recursive: true });

    images.forEach((image, index) => {
        const oldPath = path.join(__dirname, 'uploads', req.files[`image${index}`][0].filename);
        const newPath = path.join(imagesFolderPath, image);
        fs.renameSync(oldPath, newPath);
    });

    fs.writeFileSync(jsonFilePath, JSON.stringify(itemData, null, 2));

    res.json({ message: 'Item successfully saved.' });
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
