import { Link } from 'react-router-dom';
import './landing-page.css';

function Homepage() {
	return (
		<>
			<div className='landing-page'>
				<div className='landing-page-image-container'>
					<div className='landing-page-text-container'>
						<p className='lading-page-title'>Secure your medical documents on decentralized storage</p>
						<p className='lading-page-subtitle'>The easiest and the most secure way to save your documents</p>
						<div className='buttons'>
							<Link to={'/upload'}>
								<div className='primary-button'>Upload files</div>
							</Link>
							<Link to={'/allDocuments'}>
								<div className='secondary-button'>Check all documents</div>
							</Link>
						</div>
					</div>
					<div className='landing-page-image'>
						<img src={require('./images/LandingImage.png')} style={{ width: '100%' }} />
					</div>
				</div>
			</div>
		</>
	);
}
export default Homepage;
