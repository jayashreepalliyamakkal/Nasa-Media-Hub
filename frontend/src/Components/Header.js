
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="bg-gray-800 p-4 text-white flex justify-between items-center">
            {/* Title on the left side */}
            <h1 className="text-xl font-bold">NASA Media Hub</h1> 

            {/* Navigation links on the right side */}
            <nav className="flex space-x-8"> 
                <Link to="/" className="font-bold hover:text-gray-400 transition-colors">Home</Link>
                <Link to="/apod" className="hover:text-gray-400 transition-colors">APOD</Link>
                <Link to="/media" className="hover:text-gray-400 transition-colors">NASA Media</Link>
            </nav>
        </header>
    );
};

export default Header;
