import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: Arial, Helvetica, sans-serif;
  border-bottom: 1px solid blue;
  padding-bottom: 20px;

  div {
    flex: 1;
    div {
      display: flex;
      justify-content: space-between;
    }
  }

  img {
    max-width: 100px;
    margin-left: 40px;
  }
`
