export function cookieParser(cookieHeader:string = "") {
    const cookies:Record<string,string> = {}

    cookieHeader.split(";").forEach((v)=>{
        const [key, ...res] = v.trim().split("=")
        let val = res.join("=")
        if(key) cookies[key] = val
    })

    return cookies
}