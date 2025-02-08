const express = require("express")

const mysql = require("mysql2")
// const mysql = require("mysql");

const app = express()

app.use(express.json())

//configure mysql connection 

const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "Bombom123#",
    database: "library",
    port: 3307
})


// connect to mysql 
connection.connect((err) => {
    if (err) {
        console.log("error connection to mySQL:", err)
    }
})





// add a new book 

app.post("/books", (req, res) => {

    const { id, name, title } = req.body

    const query = "insert into books (id,name,title) values (?,?,?)"

    connection.query(query, [id, name, title], (err) => {
        if (err) {
            return res.status(500).json({ error: "error adding new book", details: err.message })
        }

        res.status(201).json({ message: "book has been added" })
    })
})

//get all books

app.get("/books", (req, res) => {

    const query = "select * from books "

    connection.query(query, (err, results) => {

        if (err) {
            return res.status(500).json({
                error: "error retrieving the books",
                details: err.message
            })
        }

        res.json(results)
    }
    )

})

// get book by id 
app.get("/books/:id", (req, res) => {
    const query = "select * from books where id = ?"

    connection.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: "error retrieving the book by this id",
                details: err.message
            })
        }

        if (results.length === 0) {
            return res.status(404).json({
                Message: "book by this id is not found"
            })


        }

        res.json(results[0])

    })
})

// update book by id 

app.put("/books/:id", (req, res) => {
    const { name, title } = req.body

    const query = "update books set name =? , title=? where id =?"

    connection.query(query, [name, title, req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: "error updating the book by this id",
                details: err.message
            })
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({
                Message: "Book not found to update"
            })
        }

        res.status(200).json({
            Message: "Book has been updated "
        })
    })
})

// delete book by id 

app.delete("/books/:id", (req, res) => {
    const query = "delete from books where id =?"
    connection.query(query, [req.params.id], (err, results) => {

        if (err) {
            return res.status(500).json({
                error: "error deleting the book by this id",
                details: err.message
            })
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({
                Message: "Book not found can't delete"
            })
        }

        res.status(200).json({
            Message: "Book has been deleted "
        })

    })

})


// update the transalation by book id 
app.patch("/books/:id/translation", (req, res) => {

    const { lanaguage } = req.body

    if (!lanaguage || typeof lanaguage !== "string") {
        return res.status(400).json({ error: "sorry invalid or missing language" })
    }

    const query = "update books set title = CONCAT(title, '- (',?,')') where id = ?"

    connection.query(query, [lanaguage, req.params.id], (err, results) => {

        if (err) {
            return res.status(500).json({
                error: "error updating translation",
                details: err.message
            })
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({
                Message: "Book not found "
            })
        }

        res.status(200).json({
            Message: "Book translation has been updated "
        })

    })


})



// get all city

app.get("/cities", (req, res) => {
    const query = "select distinct city from bookshop";
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving cities", details: err.message });
        }
        res.json(results);
    });
});



// Get bookshop by ID
app.get("/bookshop/:id", (req, res) => {
    const query = "select * from bookshop WHERE shop_id = ?";
    connection.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving bookshop", details: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Bookshop not found" });
        }
        res.json(results[0]);
    });
})

// Get bookshop by name
app.get("/bookshop/name/:name", (req, res) => {
    const query = "select * from bookshop where name = ?";
    connection.query(query, [req.params.name], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving bookshop", details: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Bookshop not found" });
        }
        res.json(results);
    });
});

// Get bookshop by email
app.get("/bookshop/email/:email", (req, res) => {
    const query = "select * from bookshop WHERE email = ?";
    connection.query(query, [req.params.email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving bookshop", details: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Bookshop not found" });
        }
        res.json(results);
    });
});



// Update bookshop name
app.put("/bookshop/:id/name", (req, res) => {
    const { name } = req.body;
    const query = "update bookshop set name = ? where shop_id = ?";
    connection.query(query, [name, req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error updating bookshop name", details: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Bookshop not found" });
        }
        res.status(200).json({ message: "Bookshop name updated successfully" });
    });
});


// Update bookshop email
app.put("/bookshop/:id/email", (req, res) => {
    const { email } = req.body;
    const query = "update bookshop set email = ? where shop_id = ?";
    connection.query(query, [email, req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error updating bookshop email", details: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Bookshop not found" });
        }
        res.status(200).json({ message: "Bookshop email updated successfully" });
    });
});


// delete one shop
app.delete('/bookshop/:id', (req, res) => {
    const query = 'delete from bookshop where shop_id = ?';
    connection.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error deleting the shop', details: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Shop not found' });
        }
        res.status(200).json({ message: 'Shop has been deleted' });
    });
});


// add only one shop
app.post('/bookshop', (req, res) => {
    const { city, name, contactNumber, email, Address } = req.body;
    if (!city || !name) {
        return res.status(400).json({ error: 'City and Name are required' });
    }
    const query = 'insert into bookshop (city, name, contactNumber, email, Address) values  (?, ?, ?, ?, ?)';
    connection.query(query, [city, name, contactNumber, email, Address], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error adding the shop', details: err.message });
        }
        res.status(201).json({ message: 'Shop has been added', shop_id: results.insertId });
    });
});


// start the server 

const port = 3002

app.listen(port, () => {
    console.log("server has been started on " + `http://localhost/${port}`)
})