using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Repository.Pattern.Infrastructure;
using Repository.Pattern.Repositories;
using System.Reflection;

namespace Repository.Pattern.Ef6
{
    public sealed class QueryFluent<TEntity> : IQueryFluent<TEntity> where TEntity : class, IObjectState
    {
        #region Private Fields
        private readonly Expression<Func<TEntity, bool>> _expression;
        private readonly List<Expression<Func<TEntity, object>>> _includes;
        private readonly Repository<TEntity> _repository;
        private Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> _orderBy;
        #endregion Private Fields

        #region Constructors
        public QueryFluent(Repository<TEntity> repository)
        {
            _repository = repository;
            _includes = new List<Expression<Func<TEntity, object>>>();
        }

        public QueryFluent(Repository<TEntity> repository, IQueryObject<TEntity> queryObject) : this(repository) { _expression = queryObject.Query(); }

        public QueryFluent(Repository<TEntity> repository, Expression<Func<TEntity, bool>> expression) : this(repository) { _expression = expression; }
        #endregion Constructors

        public IQueryFluent<TEntity> OrderBy(Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy)
        {
            _orderBy = orderBy;
            return this;
        }
        public IQueryFluent<TEntity> OrderByField(string order, string sortField)
        {
            Type typeQueryable = typeof(IQueryable<TEntity>);
            ParameterExpression argQueryable = Expression.Parameter(typeQueryable, "p");
            var outerExpression = Expression.Lambda(argQueryable, argQueryable);
            string[] props = sortField.Split('.');
            Type type = typeof(TEntity);
            ParameterExpression arg = Expression.Parameter(type, "x");

            Expression expr = arg;
            foreach (string prop in props)
            {
                PropertyInfo pi = type.GetProperty(prop, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
                expr = Expression.Property(expr, pi);
                type = pi.PropertyType;
            }
            LambdaExpression lambda = Expression.Lambda(expr, arg);
            string methodName = order == "asc" ? "OrderBy" : "OrderByDescending";

            MethodCallExpression resultExp =
                Expression.Call(typeof(Queryable), methodName, new Type[] { typeof(TEntity), type }, outerExpression.Body, Expression.Quote(lambda));
            var finalLambda = Expression.Lambda(resultExp, argQueryable);
            _orderBy = (Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>)finalLambda.Compile();
            return this;
        }
        public IQueryFluent<TEntity> Include(Expression<Func<TEntity, object>> expression)
        {
            _includes.Add(expression);
            return this;
        }

        public IEnumerable<TEntity> SelectPage(int page, int pageSize, out int totalCount)
        {
            totalCount = _repository.Select(_expression).Count();
            return _repository.Select(_expression, _orderBy, _includes, page, pageSize);
        }

        public IEnumerable<TEntity> Select() { return _repository.Select(_expression, _orderBy, _includes); }

        public IEnumerable<TResult> Select<TResult>(Expression<Func<TEntity, TResult>> selector) { return _repository.Select(_expression, _orderBy, _includes).Select(selector); }

        public async Task<IEnumerable<TEntity>> SelectAsync() { return await _repository.SelectAsync(_expression, _orderBy, _includes); }

        public IQueryable<TEntity> SqlQuery(string query, params object[] parameters) { return _repository.SelectQuery(query, parameters).AsQueryable(); }
    }
}