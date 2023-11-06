import './styles.css';
import img from './images/delete.png';
import Web3 from 'web3';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useEffect, useState } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { loadContract } from './utils/load-contract';
import { Link, useNavigate } from 'react-router-dom';

const projectId = process.env.REACT_APP_PROJECT_ID;
const projectSecretKey = process.env.REACT_APP_PROJECT_KEY;
const authorization = 'Basic ' + btoa(projectId + ':' + projectSecretKey);

function AllDocuments() {
	const navigate = useNavigate();
	const [searchText, setSearchText] = useState('');

	const ipfs = ipfsHttpClient({
		url: 'https://ipfs.infura.io:5001/api/v0',
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

	const [files, setFiles] = useState([]);

	useEffect(() => {
		const loadProvider = async () => {
			const provider = await detectEthereumProvider();
			const contract = await loadContract('File', provider);

			if (provider) {
				setWeb3API({
					web3: new Web3(provider),
					provider,
					contract,
				});
			} else {
				console.error('Please, install Metamask.');
			}
		};

		loadProvider();
	}, []);

	useEffect(() => {
		const getAccounts = async () => {
			try {
				const accounts = await web3API.web3.eth.requestAccounts();
				setAccount(accounts[0]);
				const res = await web3API.contract.getFiles({
					from: accounts[0],
				});
				const files = res[0]?.map((file, index) => ({ path: res[0][index], name: res[1][index] }));
				setFiles(files);
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

	const goBack = () => navigate(-1);

	const noFiles = files.length == 0;

	const openFile = (url) => window.open(url, '_blank', 'noreferrer');

	return (
		<div className='upload-file'>
			<div className='upload-file-container'>
				<div className='upload-file-page-text-container'>
					<div>
						<div style={{ display: 'flex', flexDirection: 'row', gap: 20, alignItems: 'center' }}>
							<div style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center', cursor: 'pointer' }} onClick={goBack}>
								<img src={require('./images/back.png')} height={30} />
								<span>Back</span>
							</div>
							<p className='lading-page-title'>File</p>
						</div>
						<p className='lading-page-subtitle'>List of all secured files</p>
					</div>
					<div className='upload-file-body'>
						{!noFiles && (
							<>
								<div className='search-container'>
									<input placeholder='Search...' onChange={(e) => setSearchText(e.target.value)} />
								</div>
								<div className='files-list'>
									{files
										?.filter((e, i) => {
											return e.name.toLowerCase()?.includes(searchText?.toLowerCase());
										})
										?.map((fileData, index) => (
											<div className='file-item' onClick={() => openFile('https://skywalker.infura-ipfs.io/ipfs/' + fileData.path)}>
												<p className='files-display'>{fileData.name}</p>
												<img
													className='delete-img'
													src={img}
													alt=''
													onClick={(e) => {
														e.stopPropagation();
														deleteFile(fileData.path);
													}}
												/>
											</div>
										))}
								</div>
							</>
						)}
						{noFiles && (
							<div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
								<label className='no-files-uploaded'>No uploaded files...</label>
								<Link to={'/upload'}>
									<p className='you-can-upload-files-here'>You can upload files here</p>
								</Link>
							</div>
						)}
					</div>
				</div>
				<div className='landing-page-image'>
					<img src={require('./images/LandingImage.png')} style={{ width: '100%' }} />
				</div>
			</div>
		</div>
	);
}
export default AllDocuments;
