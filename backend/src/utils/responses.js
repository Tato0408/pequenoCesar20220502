const status200 = (res,data) =>{
    return res.status(200).json({message: data})
}

const status500 = (res,data) =>{
    return res.status(500).json({message: data})
}
