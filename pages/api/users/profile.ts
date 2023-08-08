const getFunction = (req: Request, res: any) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(
    {
      id: 1,
      username: 'connor92', 
      fullname: 'Connor Street Eugene',
      profile_image: 'https://img.freepik.com/foto-gratis/joven-confiado_1098-20868.jpg?t=st=1681790781~exp=1681791381~hmac=e7a9f1fd2c2ff3892d470cd5a02a18d08db3ef4524596f1dbaa5cde540254dda',
      phone_number: '1234***5678',
      email: 'test***135@gmail.com'
    }
  );
};

const postFunction = (req: Request, res: any) => {
  // Código para procesar la petición POST
  res.status(200).json({ message: 'POST request processed' });
};

const patchFunction = (req: Request, res: any) => {
  // Código para procesar la petición PATCH
  res.status(200).json({ message: 'PATCH request processed' });
};

const deleteFunction = (req: Request, res: any) => {
  // Código para procesar la petición DELETE
  res.status(200).json({ message: 'DELETE request processed' });
};

export default async function handler(req: Request, res: any) {
  if (req.method === 'GET') {
    return getFunction(req, res);
  } else if (req.method === 'POST') {
    return postFunction(req, res);
  } else if (req.method === 'PATCH') {
    return patchFunction(req, res);
  } else if (req.method === 'DELETE') {
    return deleteFunction(req, res);
  } else {
    res.setHeader('Allow', ['GET','POST','PATCH','DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}