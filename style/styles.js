import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  containerHeaderBlue: {
    backgroundColor: '#06b6d4',
    borderStyle: 'none',
    borderWidth: 0
  },

  container: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 14,
    textTransform: 'capitalize',
  },

  image: {
    flex: 1,
    aspectRatio: 1,
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: -10,
    width: "100%",
    height: "100%",
  },

  containerBlue: {
    flex: 1,
    backgroundColor: '#06b6d4',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 20,
  },

  containerGray: {
    width: '100%',
    flex: 1,
    overflow: 'visible',
    height: '100%'
  },
  containerWhite: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 16,
    padding: 20,
  },

  bannerImage: {
    width: '100%',
    height: 160,
  },
  header: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  header2: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  paragraph: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '400'
  },
  text: {
    color: '#fff',
  },
  button: {
    padding: 4,
  },
  inputWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingLeft: 20,
    paddingRight: 20, borderRadius: 8
  },
  inputText: {
    flexGrow: 1,
    paddingTop: 10,
    paddingBottom: 10,
    color: '#27272a',
    fontSize: 14,
    backgroundColor: '#fff',
  },

  subContainer: {
    width: '100%',
    maxWidth: 450,
    zIndex: -10,
    display: 'flex',
    flexDirection: "column",
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  carouselContainer: {
    width: '100%',
    height: 230,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 10,
  },

  inputContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: "column",
    gap: 8
  },

  shadow: {
    shadowColor: '#2b2b2b',      // Shadow color
    shadowOpacity: 0.1,       // Shadow opacity (0.0 - 1.0) - Increase opacity for a darker shadow
    shadowRadius: 6,          // Shadow radius
    elevation: 1,             // Elevation (for Android)
    // Additional shadow properties (optional)
    shadowOffset: {
      width: 0,              // Horizontal offset
      height: 2,             // Vertical offset
    },
  },
})