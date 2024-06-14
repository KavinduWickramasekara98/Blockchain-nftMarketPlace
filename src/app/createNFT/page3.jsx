"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation"
export default function Home() {
  const [file, setFile] = useState("");
  const [cid, setCid] = useState("");
  const [uploading, setUploading] = useState(false);
  const [formInput,updateFormInput] =useState({price:"",name:"",description:""})
  const [fileUrl,setFileUrl] = useState(null)
  const inputFile = useRef(null);

  const router=useRouter()
  const uploadFile = async (fileToUpload) => {
    try {
      setUploading(true);
      // const data = new FormData();
      // data.set("file", fileToUpload);
      // console.log(fileToUpload);
      // const res = await fetch("/createNFT/api", {
      //   method: "POST",
      //   body: data,
      // });
      const data = JSON.stringify({
        name: "Pinnie1",
        description: "Pinnie the Pinata",
        image: "ipfs://QmVLwvmGehsrNEvhcCnnsw5RQNseohgEkFNN1848zNzdng",
        external_url: "https://pinata.cloud",
      });
    
      const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${JWT}`,
        },
        body: data,
      });


      const resData = await res.json();
        setCid(resData.IpfsHash);
        setUploading(false);
      } catch (e) {
        console.log(e);
        setUploading(false);
        alert("Trouble uploading file");
      }
  };
const uploadToPinata = async(file)=>{
  if (file) {
    try{
      setUploading(true);
      const formData = new FormData();
      formData.append("file",file);

      const response = await axios({
        method:"post",
        url:"https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: formData,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${JWT}`,
        },
      });
      console.log("IPFS Hash : " +response.data.IpfsHash);
      setFileUrl(`https://blue-causal-ferret-238.mypinata.cloud/ipfs/${response.data.IpfsHash}`)
      console.log("IPFS Hash : "+ fileUrl);
      setUploading(false);
    }catch(e){
      setUploading(false);
      console.log("upload to Pinata "+e);
    }
  }
}
  const handleChange = (e) => {
    const {name,description,price}=formInput
    if(!name || !description || !price || !fileUrl){
      alert("Field is empty");
      return;
    } 
    setFile(e.target.files[0]);
    uploadToPinata(e.target.files[0]);
    //uploadFile(e.target.files[0]);
  };

  async function createItem(){
    const {name,description,price}=formInput
    if(!name || !description || !price || !fileUrl) return;
  
    console.log("name : "+name +"/nDescription"+description+"/nPrice"+price);
    //create json string of data going to pass
    //use json format
    const data = JSON.stringify({
      name,description,image:fileUrl
    })
    try {
      //pin to ipfs
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      createSale(url);
    } catch (e) {
      console.log('error uploading file : ',error)
    }
  }

//get image file get url and set useState
  async function onChange(e){
      
    const files = e.target.files;
    if (files.length === 0) {
      console.log("FILE IS EMPTY");
      // Handle no file selected case (optional)
      return;
    }
    const file = files[0];
    console.log("FILE length "+files.length);
    // Safely access the first file (file[0])
    // ... rest of your code using the file

  try{
    //go to auth infura,upload ipfs and pin(for avoid garbage collecting)
    const added = await client.add(
      file,{
        //show UI how much of file uploaded
        progress:(prog)=>console.log(`received:${prog}`)
      }
    )
    //added.path = CID of image = image's ipfs path
    const url=`https://ipfs.infura.io:5001/${added.path}`
    //update setFileUrl State
    setFileUrl(url)

    //if anything is wrong
  }catch(e){
    console.log("error uploading file , please try again :"+e);
  }
}

  return(
    
    //convert in to meta data
    //publish data to ipfs
    //mint NFTs
    //read event from blockchain catch backend and send it to U

    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
          <input 
          placeholder="Enter NFT name" 
          className="mt-8 border rounded p-4"
          onChange={e=>updateFormInput({...formInput,name:e.target.value})}
          />
          <textarea
          placeholder="Enter NFT description"
          className="mt-2 border rounded p-4"
          onChange={e=>updateFormInput({...formInput,description:e.target.value})}

          />

          <input
          placeholder="Enter NFT price in Eth"
          className="mt-2 border rounded p-4"
          onChange={e=>updateFormInput({...formInput,price:e.target.value})}
          />

          <input 
          type="file"
          name="asset"
          className="my-3"
          onChange={onChange}
          />
          <input className="my-3" type="file" id="file" ref={inputFile} onChange={handleChange} />
          {/* {
            fileUrl && (
              <img className="rounded mt-4" width="350" src={fileUrl} />
            )
          } */}
          
      <button disabled={uploading} onClick={() => inputFile.current.click()} className="font-bold mt-4 bg-gradient-to-r from-green-400 to-blue-500 hover:to-yellow-500 text-white rounded pd-7 shadow-lg ">
        {uploading ? "Uploading NFT" : " Create NFT"}
      </button>
         
      </div>
    </div>
  )
  return (
    <main className="w-full min-h-screen m-auto flex flex-col justify-center items-center">
      <input type="file" id="file" ref={inputFile} onChange={handleChange} />
      <button disabled={uploading} onClick={() => inputFile.current.click()}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </main>
  );
}



