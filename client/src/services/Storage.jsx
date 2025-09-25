

export const setLocalStorage =async (key,value) =>{
     await localStorage.setItem(key,JSON.stringify(value))
}

export const getLocalStorage = async (key)=>{
    const result =  await localStorage.getItem(key)
    return JSON.parse(result)
}

export const deleteLocalStorage = async()=>{
     await localStorage.clear()
}