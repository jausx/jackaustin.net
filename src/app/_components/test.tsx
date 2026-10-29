// Source - https://stackoverflow.com/a/46586783
// Posted by Kristaps Taube
// Retrieved 2026-06-12, License - CC BY-SA 3.0

class ItchWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDesktop: false //This is where I am having problems
    };

    this.updatePredicate = this.updatePredicate.bind(this);
  }
  componentDidMount() {
    this.updatePredicate();
    window.addEventListener("resize", this.updatePredicate);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updatePredicate);
  }

  updatePredicate() {
    this.setState({ isDesktop: window.innerWidth > 1450 });
  }

  render() {
    const isDesktop = this.state.isDesktop;

    return (
      <div>
        {isDesktop ? (
          <div>I show on 1451px or higher</div>
        ) : (
          <div>I show on 1450px or lower</div>
        )}
      </div>
    );
  }
}
