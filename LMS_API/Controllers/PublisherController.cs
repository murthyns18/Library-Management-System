using LMS_API.Interfaces;
using LMS_API.Models;
using LMS_API.Repositories;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Text.Json;

namespace LMS_API.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class PublisherController : BaseController
    {
        private readonly IPublisherRepository _publisherRepository;

        public PublisherController(IPublisherRepository publisherRepository)
        {
            _publisherRepository = publisherRepository;
        }

        [HttpGet]
        public IActionResult PublisherList(int publisherID)
        {
            try
            {
                IEnumerable<Publisher> list = _publisherRepository.GetList(publisherID);
                return Ok(list);
            }
            catch
            {
                return StatusCode(500, new { message = "Unable to fetch publisher list." });
            }
        }

        [HttpPost]
        public IActionResult SavePublisher(Publisher publisher)
        {
            if (!ModelState.IsValid) return BadRequest(new { message = "Invalid data." });

            try
            {
                string message = _publisherRepository.SavePublisher(publisher);
                return Ok(new { message });
            }
            catch
            {
                return StatusCode(500, new { message = "Unable to save publisher." });
            }
        }

        [HttpPost]
        public IActionResult DeletePublisher([FromBody] dynamic data)
        {
            try
            {
                JsonElement json = (JsonElement)data;

                int publisherID = json.GetProperty("publisherID").GetInt32();
                bool forceDelete = json.GetProperty("forceDelete").GetBoolean();

                var result = _publisherRepository.DeletePublisher(publisherID, forceDelete);

                return Ok(new
                {
                    success = result.Success,
                    hasBooks = result.HasBooks,
                    message = result.Message
                });
            }
            catch
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Unable to delete publisher."
                });
            }
        }
    }
}
