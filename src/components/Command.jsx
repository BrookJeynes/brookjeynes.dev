import '../App.css';

const Command = (props) => {
  const Tag = props.tag;
  const command = props.command;
  const blink = props.blink;

  return (
    <div className="command-container">
      <Tag><span className="text-green">❯</span> { command && command }{ blink && <span className="blink">|</span>}</Tag>
    </div>
  );
}

export default Command;