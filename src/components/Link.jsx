import '../App.css';

const Link = (props) => {
  const { link, text } = props; 

  return<a target="_blank" className="header-link-active" rel="noreferrer noopener" href={link}>{text}</a> 
}

export default Link;
