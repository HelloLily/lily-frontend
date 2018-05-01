import React, { Component } from 'react';
import ReactPaginate from 'react-paginate';

const DEFAULT_PAGE_SIZE = 20;

class Pagination extends Component {
  constructor(props) {
    super(props);

    const pageSize = props.pageSize || DEFAULT_PAGE_SIZE;

    this.state = {
      pageSize,
      page: 1
    };
  }

  handlePageClick = data => {
    // Selection starts at 0, while the API starts at 1.
    const page = data.selected + 1;

    this.props.setPage(page).then(() => {
      this.setState({ page });
    });
  };

  render() {
    const { page } = this.state;
    const { pagination } = this.props;
    const { total, numberOfPages } = pagination;

    const pageSize = this.state.pageSize || DEFAULT_PAGE_SIZE;

    const rangeMin = (page - 1) * pageSize;

    // Display the total as the right side of the range indication if we've reached the final items.
    const rangeMax = (page === numberOfPages) ? total : rangeMin + pageSize;

    return (
      <div>
        Showing {rangeMin} to {rangeMax} of {total} items

        {
          // Only show pagination if there are more than 1 pages.
          numberOfPages > 1 &&
          <ReactPaginate
            previousLabel={<i className="lilicon hl-toggle-left-icon" />}
            nextLabel={<i className="lilicon hl-toggle-right-icon" />}
            breakLabel={<span>...</span>}
            breakClassName="break-me"
            pageCount={numberOfPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.handlePageClick}
            containerClassName="pagination"
            subContainerClassName="pages pagination"
            activeClassName="active"
          />
        }
      </div>
    );
  }
}

export default Pagination;
