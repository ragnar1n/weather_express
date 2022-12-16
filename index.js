const express=require('express')
const app= express()
const path=require('path')
const fetch=require('node-fetch')
const {response} = require("express");

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

const key='6cec3250795104e5b0a08a43046cdb28'

const getWeatherDataPromise=(url)=>{
    return new Promise((resolve,reject)=>{
        fetch(url)
            .then(response=>{
                return response.json()
            })
            .then(data=>{
                let description=data.weather[0].description
                let city=data.name
                let temp=Math.round(parseFloat(data.main.temp)-273.15)
                let result={
                    description:description,
                    city:city,
                    temp:temp
                }
                resolve(result)
            })
            .catch(error=>{
            reject(error)
        })
    })
}

app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.all('/',function (req,res){
    let city
    if (req.method=='GET'){
        city='Tartu'
    }
    if (req.method=='POST'){
        city=req.body.cityname
    }
    let url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`
    getWeatherDataPromise(url)
        .then(data=>{
            res.render('index',data)
        })
})

app.listen(3003)