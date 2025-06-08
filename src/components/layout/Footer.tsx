
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-[rgba(44,62,80,0.9)] text-white py-3.5 px-4 text-center shadow-header-footer mt-auto text-base">
      <p>&copy; {currentYear} المحترف لحساب الكميات. جميع الحقوق محفوظة.</p>
    </footer>
  );
};

export default Footer;

    