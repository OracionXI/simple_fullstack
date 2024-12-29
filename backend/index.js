const express = require('express');
const {PrismaClient} = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

//cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

//test api
app.get('/test', (req, res) => {
    try {
        res.status(200).json({ message: 'API is working!' });
    }catch(error) {
        res.status(500).json({ message: error.message });
    }
});

//get all users
app.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//get user by id
app.get('/users/:id', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(req.params.id) },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//create user
app.post('/users', async (req, res) => {
    try {
        const user = await prisma.user.create({
            data: { name: req.body.name, email: req.body.email },
        });

        res.status(201).json(user);
    } catch (error) {
        if (error.code === 'P2002') {
            res.status(400).json({ message: 'Email already exists' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
});

//update user
app.put('/users/:id', async (req, res) => {
    try {
        const user = await prisma.user.update({
            where: { id: parseInt(req.params.id) },
            data: { name: req.body.name, email: req.body.email },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        if (error.code === 'P2002') {
            res.status(400).json({ message: 'Email already exists' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
});

//delete user
app.delete('/users/:id', async (req, res) => {
    try {
        const user = await prisma.user.delete({
            where: { id: parseInt(req.params.id) },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});