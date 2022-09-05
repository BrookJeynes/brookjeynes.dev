import '../App.css';

const Arguments = (props) => {
  const { required = false, name, type, description, defaults, colour = true } = props;
  
  return (
    <div className="arguments-container flex justify-start md:items-center md:flex-row items-start flex-col ">
      {required && <span className="w-[5%]" style={{color: '#BF616A'}}>*</span>}
      <span className="mr-5 md:w-[15%] w-[100%]" style={{color: colour ? '#88C0D0' : '#ECEFF4'}}>{name}</span>
      <span className="mr-5 w-[10%]" style={{color: colour ? '#EBCB8B' : '#ECEFF4'}}>{type}</span>
      <span className="mr-5 md:w-[20%] w-[100%]"> {description}</span>
      <span className="md:w-[80%] w-[100%]">{defaults && <span className="font-bold">[default: {defaults}]</span>} {required && <span style={{color: '#BF616A'}}>[required]</span>}</span>
    </div>
  );
}

export default Arguments;