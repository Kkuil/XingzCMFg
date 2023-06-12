import JSEncrypt from "jsencrypt"
import CryptoJS from "crypto-js"
import {API_SIGN_ALGORITHM} from "@/constant/ApiSignKey.ts"

// 生成签名
export function generateSignature(message: string, privateKey: string) {
    const encryptor = new JSEncrypt()
    encryptor.setPrivateKey(privateKey)
    const signature = encryptor.sign(message, (str) => CryptoJS.SHA256(str).toString(), API_SIGN_ALGORITHM)
    return signature
}

// 验证签名
export function verifySignature(message: string, signature: string, publicKey: string) {
    const encryptor = new JSEncrypt()
    encryptor.setPublicKey(publicKey)
    const isValid = encryptor.verify(message, signature, (str) => CryptoJS.SHA256(str).toString())
    return isValid
}