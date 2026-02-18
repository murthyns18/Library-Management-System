using LMS_API.Models;
using System.Collections.Generic;

namespace LMS_API.Interfaces
{
    public interface IPublisherRepository
    {

        /// <summary>
        /// To get the Publishers
        /// </summary>
        /// <param name="publisherId">-1, 0, id</param>
        /// <returns>Return the list of publishers</returns>
        IEnumerable<Publisher> GetList(int publisherID = 0);

        /// <summary>
        /// To Save the publisher
        /// </summary>
        /// <param name="publisher"></param>
        /// <returns>Return the msg publishers saved successfully</returns>
        string SavePublisher(Publisher publisher);

        /// <summary>
        /// To delete a publisher
        /// </summary>
        /// <param name="publisherID"></param>
        /// <returns>Return msg publisher deleted successfully</returns>
        dynamic DeletePublisher(int publisherID, bool forceDelete);
    }
}
