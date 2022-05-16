const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleWare
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3sdks.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const servicesCollection = client.db('doctors_portal').collection('services')
        const bookingCollection = client.db('doctors_portal').collection('booking')


        app.get('/service', async (req, res) => {
            const query = {}
            const cursor = servicesCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)
        })
        
        // , 
        // 
        app.post('/booking', async(req, res) => {
            const booking = req.body;
            const query = {treatment: booking.treatment ,date: booking.date, patient: booking.patient}
            const exists = bookingCollection.findOne(query)

            if (exists) {
                return res.send({ success: false, booking: exists })
            }

            const result = await bookingCollection.insertOne(booking)
            return res.send({ success: true, result })
        })

        // app.get('/available', async(req, res)=>{
        //     const date = req.query.date || 'May 11'

        //     // step 1: Get all services

        //     const services = await servicesCollection.find().toArray()
        //     res.send(services)

        //     //  step 2: Get the booking of that day

        //     const query = {date: date}
        //     const bookings = await bookingCollection.find(query).toArray()


        //     // setp 3: For each services, find bookings for that service
        //     services.forEach(service =>{
        //         const serviceBookings = bookings.filter(b=> b.treatment === service.name)
        //         const booked = serviceBookings.map(s => s.slot)
        //         const available = service.slots.filter(s=>!booked.includes(s))
        //         service.available = available
        //         // service.booked = booked;
        //         // service.booked = serviceBookings.map(s => s.slot)
        //     })
        //     res.send(services)
        // })


    }

    /*
    *app.get('/booking') // get all booking in collection or get more than one or by filter
    *app.get('/booking/:id') // get a specific booking
    *app.post('/booking') // add a new booking to database
    *app.patch('/booking/:id') // update a specific booking from database
    *app.delete('/booking/:id') // delete a specific booking form database
    */

    finally {
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Doctors Portal Server')
})

app.listen(port, () => {
    console.log('listening', port);
})