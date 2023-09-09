const Left = (value) => ({
  map: (_) => Left(value),
  chain: (_) => Left(value),
  fold: (leftFn, _) => leftFn(value),
  isLeft: true,
  isRight: false,
});

const Right = (value) => ({
  map: (fn) => Right(fn(value)),
  chain: (fn) => fn(value),
  fold: (_, rightFn) => rightFn(value),
  isLeft: false,
  isRight: true,
});

module.exports = { Either: { Left, Right } };
