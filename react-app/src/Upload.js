import { useEffect, useState } from 'react';
import './styles.css';
import './upload-file-page.css';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import { loadContract } from './utils/load-contract';

const projectId = process.env.REACT_APP_PROJECT_ID;
const projectSecretKey = process.env.REACT_APP_PROJECT_KEY;
const authorization = 'Basic ' + btoa(projectId + ':' + projectSecretKey);

function Upload() {
	const [isUploaded, setUploaded] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const ipfs = ipfsHttpClient({
		url: 'https://ipfs.infura.io:5001/api/v0',
		headers: {
			authorization,
		},
	});
	const [isProviderLoaded, setProviderLoaded] = useState(false);
	const [web3API, setWeb3API] = useState({
		provider: null,
		web3: null,
		contract: null,
	});

	const [account, setAccount] = useState(null);

	const setAccountListener = (provider) => {
		provider.on('accountsChanged', (_) => window.location.reload());
	};

	useEffect(() => {
		const loadProvider = async () => {
			const provider = await detectEthereumProvider();
			if (provider) {
				try {
					const contract = await loadContract('File', provider);
					setWeb3API({
						web3: new Web3(provider),
						provider,
						contract,
					});
				} catch (e) {
					console.log(e);
				}
			} else {
				console.error('Please, install Metamask.');
			}
		};

		loadProvider();
	}, []);

	useEffect(() => {
		const getAccount = async () => {
			const accounts = await web3API.web3.eth.getAccounts();
			setAccount(accounts[0]);
		};

		web3API.web3 && getAccount();
	}, [web3API.web3]);

	const getAccounts = async () => {
		try {
			const accounts = await web3API.web3.eth.requestAccounts();
			setAccount(accounts[0]);
			setProviderLoaded(true);
		} catch (err) {
			alert(err.message);
		}
	};

	const onSubmitHandler = async (event) => {
		event.preventDefault();
		const form = event.target;
		const files = form[0].files;

		if (!files || files.length === 0) {
			return alert('No files selected');
		}

		try {
			const file = files[0];
			const result = await ipfs.add(file);

			console.log('FILE: ' + file.name);

			setUploadedFiles([
				{
					cid: result.cid,
					path: result.path,
				},
			]);

			setUploaded(true);

			await web3API.contract.saveCID(result.path, file.name, {
				from: account,
			});
			console.log(account);
		} catch (error) {
			alert(error.message);
		}

		form.reset();
	};
	return (
		<div className='upload-file'>
			<div className='upload-file-container'>
				<div className='upload-file-details'>
					<div className='upload-file-text'>Upload files</div>
					<div>lorem....</div>
					{!account && (
						<div>
							<div className='connect-button-container'>
								<p className='not-connected-to-metamask'>You are not connect to Metamask...</p>
								<button className='connect-button' onClick={getAccounts}>
									Connect with Metamask
								</button>
							</div>
						</div>
					)}
				</div>
				{/* <div className='upload-card'> */}

				{/* <hr></hr> */}
				<div className='upload-file-import-file'>
					<form
						onSubmit={(event) => {
							if (!web3API.contract || !account) {
								alert('Connect to Metamask');
							} else {
								onSubmitHandler(event);
							}
						}}
					>
						<div className='file-card'>
							<input className='input-file' type='file' />
						</div>
						<div className='button-container' type='submit'>
							<button className='upload-button' disabled={!account}>
								Save
							</button>
						</div>
						<p className='upload-file-text'>Uploaded files</p>
						{uploadedFiles.map((file, index) => (
							<>
								<a target='_blank' key={index} className='link-to-ipfs' href={'https://skywalker.infura-ipfs.io/ipfs/' + file.path}>
									Click to see uploaded file on IPFS
								</a>
							</>
						))}
					</form>
				</div>
			</div>
			{/* </div> */}
		</div>
	);
}
export default Upload;
