const express = require("express")

const mysql = require("mysql2")

const app = express()

app.use(express.json)

//configure mysql connection 

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "abed",
    database: "library"
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

        res.status(201).json({message : "book has been added"})
    })
})

//get all books

app.get("/books",(req,res)=>{

    const query = "select * from books "

    connection.query(query,(err,results)=>{

        if(err){
             return res.status(500).json({
                error:"error retrieving the books",
                details : err.message
             })}

             res.json(results)
        }
    )

})

// get book by id 
app.get("books/:id",(req,res)=>{
    const query = "select * from books where id = ?"

    connection.query(query,[req.params.id],(err,results)=>{
        if(err){
            return res.status(500).json({
               error:"error retrieving the book by this id",
               details : err.message
            })}

            if(results.length===0){
                return res.status(404).json({
                    Message : "book by this id is not found"
                })


            }

            res.json(results[0])
          
    })
})

// update book by id 

app.put("books/:id",(req,res)=>{
    const {name,title} = req.body

    const query = "update books set name =? , title=? where id =?" 

    connection.query(query,[name,title,req.params.id],(err,results)=>{
         if(err){
            return res.status(500).json({
               error:"error updating the book by this id",
               details : err.message
            })}

            if(results.affectedRows===0){
                return res.status(404).json({
                    Message:"Book not found to update"
                })
            }

            res.status(200).json({
                Message :"Book has been updated "
            })
    })
})

// delete book by id 

app.delete("/books/:id",(req,res)=>{
    const query = "delete from books where id =?"
connection.query(query,[req.params.id],(err,results)=>{

    if(err){
        return res.status(500).json({
           error:"error deleting the book by this id",
           details : err.message
        })}

        if(results.affectedRows===0){
            return res.status(404).json({
                Message:"Book not found can't delete"
            })
        }

        res.status(200).json({
            Message :"Book has been deleted "
        })

})

})


// update the transalation by book id 
app.patch("/books/:id/translation",(req,res)=>{

    const {lanaguage} = req.body

    if(!lanaguage ||typeof lanaguage !=="string"){
        return res.status(400).json({error: "sorry invalid or missing language"})
    }

    const query = "update books set title = CONCAT(title, '- (',?,')') where id = ?"

    connection.query(query,[lanaguage,req.params.id],(err,results)=>{

        if(err){
            return res.status(500).json({
               error:"error updating translation",
               details : err.message
            })}
    
            if(results.affectedRows===0){
                return res.status(404).json({
                    Message:"Book not found "
                })
            }
    
            res.status(200).json({
                Message :"Book translation has been updated "
            })
    
    })
    

})

// start the server 

const port = 3001 

app.listen(port,()=>{
    console.log("server has been started on " +`http://localhost/${port}`)
})