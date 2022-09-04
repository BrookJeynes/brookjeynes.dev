import '../App.css';

const Arguments = (props) => {
  const { required = false, name, type, description, defaults, colour = true } = props;
  
  return (
    <div className="arguments-container">
      {required && <span style={{width: 50, color: '#BF616A'}}>*</span>}
      <span style={{marginRight: 5, width: 180, color: colour ? '#88C0D0' : '#ECEFF4'}}>{name}</span>
      <span style={{marginRight: 5, width: 100, color: colour ? '#EBCB8B' : '#ECEFF4'}}>{type}</span>
      <span style={{width: '80%'}}>{description} {defaults && <span style={{fontWeight: 'bold'}}>[default: {defaults}]</span>} {required && <span style={{color: '#BF616A'}}>[required]</span>}</span>
    </div>
  );
}

export default Arguments;