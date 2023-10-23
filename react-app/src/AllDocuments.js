import "./styles.css";
import img from "./images/delete.png";
import Web3 from "web3";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "./utils/load-contract";

const projectId = process.env.REACT_APP_PROJECT_ID;
const projectSecretKey = process.env.REACT_APP_PROJECT_KEY;
const authorization = "Basic " + btoa(projectId + ":" + projectSecretKey);

function AllDocuments() {
  const ipfs = ipfsHttpClient({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers: {
      authorization,
    },
  });
  const [web3API, setWeb3API] = useState({
    provider: null,
    web3: null,
    contract: null,
  });

  const [account, setAccount] = useState(null);

  const [files, setFiles] = useState({
    0: [],
    1: [],
  });

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      const contract = await loadContract("File", provider);

      if (provider) {
        setWeb3API({
          web3: new Web3(provider),
          provider,
          contract,
        });
      } else {
        console.error("Please, install Metamask.");
      }
    };

    loadProvider();
  }, []);

  useEffect(() => {
    const getAccounts = async () => {
      try {
        const accounts = await web3API.web3.eth.requestAccounts();
        setAccount(accounts[0]);

        console.log(accounts);

        const res = await web3API.contract.getFiles({
          from: accounts[0],
        });
        console.log(res);
        setFiles(res);
      } catch (err) {
        console.log(err.message);
      }
    };

    web3API.web3 && getAccounts();
  }, [web3API.web3]);

  const refreshFiles = async () => {
    try {
      const res = await web3API.contract.getFiles({
        from: account,
      });
      setFiles(res);
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteFile = async (path) => {
    console.log(path);
    try {
      await ipfs.pin.rm(path);
      await web3API.contract.deleteFile(path, {
        from: account,
      });
      refreshFiles();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <nav>
        <a href="/">Home</a>
        <a href="/upload">Upload</a>
        <a href="/allDocuments">All documents</a>
      </nav>
      <div className="cards-container">
        <p className="files-title">files</p>
        {files[0].map((path, index) => (
          <div className="card" key={index}>
            <div className="flex-container">
              <p className="files-display">{files[1][index]}</p>
              <img
                className="delete-img"
                src={img}
                onClick={() => deleteFile(path)}
              />
            </div>
            <hr></hr>
            <p className="files-display">
              <a
                target="_blank"
                className="link-to-file"
                href={"https://skywalker.infura-ipfs.io/ipfs/" + path}
              >
                Click to see file
              </a>
            </p>
          </div>
        ))}
        {files[0].length == 0 && (
          <div className="card">No uploaded files...</div>
        )}
      </div>
    </>
  );
}
export default AllDocuments;
