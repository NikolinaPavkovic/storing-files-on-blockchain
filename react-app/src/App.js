import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './Homepage';
import Upload from './Upload_V2';
import AllDocuments from './AllDocuments_V2';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Homepage />} />
				<Route path='/upload' element={<Upload />} />
				<Route path='/allDocuments' element={<AllDocuments />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
