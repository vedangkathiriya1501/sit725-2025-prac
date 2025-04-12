var express = require("express")
var app = express()

const helloRoute = require('./routes/hello');
app.use('/api/hello', helloRoute);

const mongoose = require('mongoose');
app.use(express.static(__dirname+'/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/cars', require('./routes/cars'));
var port = process.env.port || 3000;

mongoose.connect('mongodb://localhost:27017/myprojectDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    });
    mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB!');
    });

    const ProjectSchema = new mongoose.Schema({
        title: String,
        image: String,
        link: String,
        description: String,
        });
        const Project = mongoose.model('Project', ProjectSchema);


        const sampleProjects = [
            {
                title: "w11",
                image: "images/w11.jpg",
                link: "About w11",
                description: "Demo description about w11"
            },
            {
                title: "rb16",
                image: "images/rb16.jpg",
                link: "About rb16",
                description: "Demo description about rb16"
            }
        ];
        
        Project.insertMany(sampleProjects)        


    app.get('/api/projects', async (req, res) => {
const projects = await Project.find({});
res.json({ statusCode: 200, data: projects, message: "Success" });
});

app.listen(port,()=>{
    console.log("App listening to: "+port)
    console.log(`Server is running at http://localhost:${port}`);
})