import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <Container>
        <div className="text-center">
          © {new Date().getFullYear()} Local Market Tax System
        </div>
      </Container>
    </footer>
  );
};

export default Footer;